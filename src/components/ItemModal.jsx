import Modal from "./Modal";
import Icon from "./Icon";
import VegTag from "./VegTag";


export default function ItemModal({reference, item, restaurant=null}){

    return (
        <Modal reference={reference} width="max-w-sm">
            {
                item ?
                    <>
                        {restaurant && (
                            <div className="mb-8">
                                <h2 className="flex gap-2 mb-4 text-xl font-bold capitalize truncate">
                                    <Icon iconName="store" />
                                    {restaurant.name.toLowerCase()}
                                </h2>

                                <h3 className="text-base">{restaurant.location.full_address}</h3>
                            </div>
                        )}

                        <img  className="bg-gray-200 size-28 object-cover mb-8 m-auto rounded-2xl" src={item.image} alt="" />

                        <div className="flex items-center gap-2 mb-4">
                            <VegTag isVeg={item.is_veg}/>
                            <h2 className="text-2xl capitalize">{item.name.toLowerCase()}</h2>
                        </div>
                        
                        <h2 className="flex items-center text-xl mb-4">
                            <Icon iconName="currency_rupee"/>
                            {item.price}
                        </h2>

                        <p className="text-xl mb-8">{item.description}</p>
                    </>
                :
                    <></>
            }
        </Modal>
    )
}