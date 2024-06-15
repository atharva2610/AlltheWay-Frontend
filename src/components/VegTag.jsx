import {Icon} from "../components";

export default function VegTag({isVeg}){

    return (
        <div className={`h-fit w-fit flex items-center justify-center p-0.5 ${ isVeg ? "text-emerald-500 border-emerald-500" : "text-red-600 border-red-500"} border-2 rounded-md`}>
            <Icon iconName={isVeg ? "circle" : "change_history"} className="text-sm"/>
        </div>
    )
}