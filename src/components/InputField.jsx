import { useEffect, useRef } from "react";

import FieldErrors from "./FieldErrors";

export default function InputField({type="text", label="", name="", value="", className="", placeholder="", disable=false, errors=null, optional=false}) {

    const reference = useRef(null);

    function changeValue(event){
        reference.current.value = event.target.value;
    }

    useEffect(()=>{
        reference.current.value = value;
    }, [value])

    return ( 
        <div className="">
            <div className="relative">
                <input ref={reference} onChange={changeValue} type={type} name={name} disabled={disable} className={`peer w-full p-3 text-base border focus:border-yellow-500 rounded-[36px] outline-none invalid:border-red-500 tracking-wider ${className} ${errors ? "border-red-500" : "border-gray-300"}`} placeholder={placeholder} />
                {label && <label className={`absolute top-0 left-0 translate-x-8 -translate-y-1/2 bg-white px-2 ${errors ? "text-red-500" : "text-zinc-500"} peer-focus:text-yellow-500 peer-invalid:text-red-500 text-sm`} >{label} {optional ? "(optional)" : ""}</label>}
            </div>

            <FieldErrors errors={errors} />
        </div>
     );
}