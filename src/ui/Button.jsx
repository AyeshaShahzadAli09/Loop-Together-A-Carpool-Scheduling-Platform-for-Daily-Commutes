const Button = ({type , children , disabled}) =>{
    const styles={
        "primary" :"w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-sm hover:bg-blue-600 disabled:opacity-50 flex justify-center items-center"
    }
    return(
        <button className={styles[type]} disabled={disabled}>{children}
            </button>
    )
}

export default Button;