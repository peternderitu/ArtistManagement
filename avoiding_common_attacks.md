1. Underflow/Overflow
	```bash
	using SafeMath for uint256;

	function hiremanager(uint256 managerid, uint256 periodinmonths)
        public
        payable
        onlyInEmergency
    {
        require(periodinmonths > 0);
        uint256 salarypaid = periodinmonths.mul(managers[managerid].salary);
        managers[managerid].addr.transfer(salarypaid);
        emit Loghiremanager(managerid);
    }
    ```
2. State variable state visibility
	```bash
	uint256 private musicidCount;
    	uint256 private artistCount;
    	uint256 private managerCount;
	```
