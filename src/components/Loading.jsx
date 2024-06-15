import Icon from "./Icon";

export default function Loading() {
    return ( 
        <div className="w-full mt-4 text-center">
            <Icon iconName="progress_activity" className="animate-spin"/>
        </div>
     );
}