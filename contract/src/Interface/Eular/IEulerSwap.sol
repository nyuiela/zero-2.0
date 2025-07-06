// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library Hooks {
    struct Permissions {
        bool beforeInitialize;
        bool afterInitialize;
        bool beforeAddLiquidity;
        bool afterAddLiquidity;
        bool beforeRemoveLiquidity;
        bool afterRemoveLiquidity;
        bool beforeSwap;
        bool afterSwap;
        bool beforeDonate;
        bool afterDonate;
        bool beforeSwapReturnDelta;
        bool afterSwapReturnDelta;
        bool afterAddLiquidityReturnDelta;
        bool afterRemoveLiquidityReturnDelta;
    }
}

library IPoolManager {
    struct ModifyLiquidityParams {
        int24 tickLower;
        int24 tickUpper;
        int256 liquidityDelta;
        bytes32 salt;
    }

    struct SwapParams {
        bool zeroForOne;
        int256 amountSpecified;
        uint160 sqrtPriceLimitX96;
    }
}

interface IEulerSwap {
    type BalanceDelta is int256;
    type BeforeSwapDelta is int256;
    type Currency is address;

    struct InitialState {
        uint112 currReserve0;
        uint112 currReserve1;
    }

    struct Params {
        address vault0;
        address vault1;
        address eulerAccount;
        uint112 equilibriumReserve0;
        uint112 equilibriumReserve1;
        uint256 priceX;
        uint256 priceY;
        uint256 concentrationX;
        uint256 concentrationY;
        uint256 fee;
        uint256 protocolFee;
        address protocolFeeRecipient;
    }

    struct PoolKey {
        Currency currency0;
        Currency currency1;
        uint24 fee;
        int24 tickSpacing;
        address hooks;
    }

    error AlreadyActivated();
    error AmountTooBig();
    error AssetsOutOfOrderOrEqual();
    error BadParam();
    error ControllerDisabled();
    error CurveViolation();
    error DepositFailure(bytes reason);
    error EVC_InvalidAddress();
    error HookNotImplemented();
    error InsufficientCalldata();
    error Locked();
    error LockedHook();
    error NotAuthorized();
    error NotPoolManager();
    error OperatorNotInstalled();
    error Overflow();
    error SafeERC20FailedOperation(address token);
    error SwapLimitExceeded();
    error UnsupportedPair();

    event EulerSwapActivated(address indexed asset0, address indexed asset1);
    event Swap(
        address indexed sender,
        uint256 amount0In,
        uint256 amount1In,
        uint256 amount0Out,
        uint256 amount1Out,
        uint112 reserve0,
        uint112 reserve1,
        address indexed to
    );

    function EVC() external view returns (address);

    function activate(InitialState memory initialState) external;

    function afterAddLiquidity(
        address sender,
        PoolKey memory key,
        IPoolManager.ModifyLiquidityParams memory params,
        BalanceDelta delta,
        BalanceDelta feesAccrued,
        bytes memory hookData
    ) external returns (bytes4, BalanceDelta);

    function afterDonate(
        address sender,
        PoolKey memory key,
        uint256 amount0,
        uint256 amount1,
        bytes memory hookData
    ) external returns (bytes4);

    function afterInitialize(
        address sender,
        PoolKey memory key,
        uint160 sqrtPriceX96,
        int24 tick
    ) external returns (bytes4);

    function afterRemoveLiquidity(
        address sender,
        PoolKey memory key,
        IPoolManager.ModifyLiquidityParams memory params,
        BalanceDelta delta,
        BalanceDelta feesAccrued,
        bytes memory hookData
    ) external returns (bytes4, BalanceDelta);

    function afterSwap(
        address sender,
        PoolKey memory key,
        IPoolManager.SwapParams memory params,
        BalanceDelta delta,
        bytes memory hookData
    ) external returns (bytes4, int128);

    function beforeAddLiquidity(
        address sender,
        PoolKey memory key,
        IPoolManager.ModifyLiquidityParams memory params,
        bytes memory hookData
    ) external returns (bytes4);

    function beforeDonate(
        address sender,
        PoolKey memory key,
        uint256 amount0,
        uint256 amount1,
        bytes memory hookData
    ) external returns (bytes4);

    function beforeInitialize(
        address sender,
        PoolKey memory key,
        uint160 sqrtPriceX96
    ) external returns (bytes4);

    function beforeRemoveLiquidity(
        address sender,
        PoolKey memory key,
        IPoolManager.ModifyLiquidityParams memory params,
        bytes memory hookData
    ) external returns (bytes4);

    function beforeSwap(
        address sender,
        PoolKey memory key,
        IPoolManager.SwapParams memory params,
        bytes memory hookData
    ) external returns (bytes4, BeforeSwapDelta, uint24);

    function computeQuote(
        address tokenIn,
        address tokenOut,
        uint256 amount,
        bool exactIn
    ) external view returns (uint256);

    function curve() external view returns (bytes32);

    function getAssets() external view returns (address asset0, address asset1);

    function getHookPermissions()
        external
        pure
        returns (Hooks.Permissions memory);

    function getLimits(
        address tokenIn,
        address tokenOut
    ) external view returns (uint256, uint256);

    function getParams() external pure returns (Params memory);

    function getReserves() external view returns (uint112, uint112, uint32);

    function poolKey() external view returns (PoolKey memory);

    function poolManager() external view returns (address);

    function swap(
        uint256 amount0Out,
        uint256 amount1Out,
        address to,
        bytes memory data
    ) external;
}
