export default function TextMessage({message, textSize="text-lg md:text-2xl", extraCSS=""}) {
    return ( 
        <h1 className={`text-center ${textSize} ${extraCSS}`}>{message}</h1>
     );
}