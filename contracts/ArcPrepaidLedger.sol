// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title ArcPrepaidLedger
 * @notice Reference prepaid USDC credit escrow for one platform. NOT AUDITED.
 * @dev Gateway funding/minting is NOT handled here. Users must transfer native ERC20 USDC
 *      to this contract AFTER any Gateway settlement. All values use 6 USDC decimals.
 *      Operator can charge only within a user-configured per-day cap. Users can revoke
 *      the operator instantly and withdraw unspent funds. On-chain charging one signature
 *      at a time is not economical: batch accrued offchain debits with user consent,
 *      reconciliation and dispute handling. This is a reference, not deployment-ready.
 */
interface IERC20Lite {
    function transfer(address to, uint256 value) external returns (bool);
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}
contract ArcPrepaidLedger {
    IERC20Lite public immutable usdc;
    address public owner;
    address public operator;
    address public treasury;
    mapping(address => uint256) public credits;
    mapping(address => uint256) public dailyCap;
    mapping(address => mapping(uint256 => uint256)) public debitedByDay;
    mapping(bytes32 => bool) public chargedInvoice;
    bool private entered;
    event Deposited(address indexed account,uint256 amount);
    event Withdrawn(address indexed account,uint256 amount);
    event ChargeSettled(address indexed account,bytes32 indexed invoiceId,address indexed beneficiary,uint256 amount);
    event DailyCapUpdated(address indexed account,uint256 newCap);
    event OperatorUpdated(address indexed newOperator);
    event TreasuryUpdated(address indexed newTreasury);
    modifier onlyOwner(){require(msg.sender==owner,"owner");_;}
    modifier onlyOperator(){require(msg.sender==operator,"operator");_;}
    modifier lock(){require(!entered,"reentry");entered=true;_;entered=false;}
    constructor(address token,address _treasury,address _operator){require(token!=address(0)&&_treasury!=address(0)&&_operator!=address(0),"zero");usdc=IERC20Lite(token);treasury=_treasury;operator=_operator;owner=msg.sender;}
    function setOperator(address next) external onlyOwner {require(next!=address(0),"zero");operator=next;emit OperatorUpdated(next);}
    function setTreasury(address next) external onlyOwner {require(next!=address(0),"zero");treasury=next;emit TreasuryUpdated(next);}
    function setDailyCap(uint256 cap) external {dailyCap[msg.sender]=cap;emit DailyCapUpdated(msg.sender,cap);}
    function deposit(uint256 amount) external lock {require(amount>0,"amount");require(usdc.transferFrom(msg.sender,address(this),amount),"transferFrom");credits[msg.sender]+=amount;emit Deposited(msg.sender,amount);}
    function withdraw(uint256 amount) external lock {require(amount>0&&credits[msg.sender]>=amount,"credits");credits[msg.sender]-=amount;require(usdc.transfer(msg.sender,amount),"transfer");emit Withdrawn(msg.sender,amount);}
    function charge(address account,bytes32 invoiceId,address beneficiary,uint256 amount) external onlyOperator lock {
        require(!chargedInvoice[invoiceId],"invoice settled");
        require(beneficiary!=address(0)&&amount>0,"invalid");
        uint256 dayIndex=block.timestamp/1 days;
        require(dailyCap[account]>0 && debitedByDay[account][dayIndex]+amount<=dailyCap[account],"daily cap");
        require(credits[account]>=amount,"insufficient");
        chargedInvoice[invoiceId]=true;
        debitedByDay[account][dayIndex]+=amount;
        credits[account]-=amount;
        require(usdc.transfer(beneficiary,amount),"transfer");
        emit ChargeSettled(account,invoiceId,beneficiary,amount);
    }
    function batchCharge(address[] calldata accounts,bytes32[] calldata invoiceIds,address[] calldata beneficiaries,uint256[] calldata amounts) external onlyOperator {
        require(accounts.length==invoiceIds.length&&accounts.length==beneficiaries.length&&accounts.length==amounts.length&&accounts.length<=100,"length");
        // Calling charge through an external self-call would fail operator auth;
        // inline reusable internal implementation instead in production.
        revert("batch disabled: use audited implementation");
    }
}
