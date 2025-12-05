const Card = ({ children, className, onClick, hoverable = false, style }) => {
    const baseClasses = "p-4 border-round-xl surface-card shadow-2 h-full flex flex-column";

    const hoverClasses = hoverable
        ? "cursor-pointer transition-all transition-duration-300 hover:shadow-6 hover:-translate-y-1"
        : "";

    return (
        <div
            className={`${baseClasses} ${hoverClasses} ${className || ''}`}
            style={{
                backgroundColor: 'var(--surface-card)',
                ...style
            }}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

export default Card;