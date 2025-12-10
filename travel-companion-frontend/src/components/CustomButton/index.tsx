import './index.css'

interface ButtonProps {
    buttonName: string
}

const CustomButton = ({buttonName}: ButtonProps) => {
    return (
        <div>

            <button>{buttonName}</button>
        </div>
    )
}

export default CustomButton
