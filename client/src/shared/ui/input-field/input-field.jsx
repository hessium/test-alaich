import {cn} from "../../utils/cn.js";

export const InputField = ({
                        type,
                        value,
                        onChange,
                        label,
                        placeholder,
                        error,
                        warning,
                        disabled,
                        classList,
                        id,
                    ...props
                    }) => (
    <div className='form__group'>
        <label htmlFor={id} className='form__label'>{label}</label>
        <input
            type={type}
            id={id}
            value={value}
            placeholder={placeholder}
            className={cn('form__input', error && 'no-validate', classList)}
            onChange={onChange}
            disabled={disabled}
            {...props}
        />
        {warning && <span className='form__warning'>{warning}</span>}
    </div>
);