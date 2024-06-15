import Icon from "./Icon";

export default function CategoryDropdown({handleOpenModal, cuisineName, itemsList, setPassItem}) {

    return ( 
        <>
        <details className="my-8">
            <summary className="cursor-pointer text-lg font-bold capitalize">{cuisineName.toLowerCase()}</summary>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-12 py-8">
            
                {itemsList.map( item => (
                    <div key={item.id} id={item.id} onClick={()=>{
                        setPassItem(item);
                        handleOpenModal();
                        }} className="cursor-pointer flex gap-4">

                        <div className="rounded-md">
                            <img  className="size-32 object-fill rounded-md" src={item.image} alt="" />
                        </div>

                        <div className="flex flex-col gap-2">
                            
                            <div className={`flex items-center gap-1 ${item.is_veg ? "text-green-600" : "text-red-600"}`}>
                                <Icon iconName="radio_button_checked" className="text-base font-bold"/>
                                <span className="text-sm font-bold">{item.is_veg ? "VEG" : "NON-VEG"}</span>
                            </div>

                            <h2 className="text-xl font-bold capitalize">{item.name.toLowerCase()}</h2>

                            <span className="flex items-center text-base font-bold"><Icon iconName="currency_rupee" className="text-lg"/> {item.price}</span>
                        </div>
                    </div>
                    )
                )}

            </div>
        </details>
        
        </>
     );
}