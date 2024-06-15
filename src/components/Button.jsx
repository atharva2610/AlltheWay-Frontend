import Icon from "./Icon";


function Button({children, type, onClick, extraCSS}) {
    return ( 
        <button type={type} className={`flex items-center justify-center gap-1 text-base leading-none rounded-[36px] outline-none ${extraCSS}`} onClick={onClick}>{children}</button>
     );
}

export function PrimaryButton({children, type="button", onClick=null, iconName=null, bgColor="bg-yellow-500", padding="px-4 py-2", textColor="text-black", borderColor="border-transparent", extraCSS=""}){
    
    return (
        <Button type={type} onClick={onClick} extraCSS={`${bgColor} ${padding} ${textColor} ${borderColor} ${extraCSS}`}>
            {iconName && <Icon iconName={iconName}/>}
            {children}
        </Button>
    )
}

export function SecondaryButton({children, type="button", onClick=null, iconName=null, bgColor="bg-transparent", padding="px-4 py-2", textColor="text-black", borderColor="border-gray-300", extraCSS=""}){
    
    return (
        <Button type={type} onClick={onClick} extraCSS={`${bgColor} ${padding} ${textColor} border ${borderColor} ${extraCSS}`}>
            {iconName && <Icon iconName={iconName}/>}
            {children}
        </Button>
    )
}

export function IconButton({iconName, type="button", onClick=null, bgColor="bg-transparent", textColor="text-zinc-500", hover="md:hover:bg-gray-200", extraCSS=""}){
    return (
        <Button type={type} onClick={onClick} extraCSS={`${bgColor} p-1.5 ${textColor} ${hover} ${extraCSS}`} >
            <Icon iconName={iconName}/>
        </Button>
    )
}