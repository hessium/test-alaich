import {cn} from "../../utils/cn.js";

export  const Button = ({ loading, children, classList, type = "button", ...props }) => (
    <button
        type={type}
        disabled={loading}
        {...props}
        className={cn('btn', loading && 'loading', classList)}
    >
        {loading ? 'Loading...' : children}
    </button>
);
