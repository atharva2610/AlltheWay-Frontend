export default function Icon({iconName, className=""}) {
    
    return (
        <span className={`material-symbols-rounded ${className} leading-none`}>{iconName}</span>
    );
}