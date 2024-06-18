import { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { SecondaryButton, Icon, Loading, TextMessage, VegTag, IconButton, ConfirmBox } from "../../components";

import ItemForm from "../../forms/ItemForm";
import ImageForm from "../../forms/ImageForm";

import useServerRequest from "../../helper/useServerRequest";


export default function ItemDetail(){

    const navigate = useNavigate();
    const {item_id} = useParams();
    const confirmBoxReference = useRef(null);
    const itemFormReference = useRef(null);
    const imageFormReference = useRef(null);

    const [isProcessingItem, setNewNotification, serverRequest] = useServerRequest();

    const [item, setItem] = useState(null);


    function handleOpenItemForm(){
        itemFormReference.current.classList.remove("hidden");
    }

    function handleOpenImageForm(){
        imageFormReference.current.classList.remove("hidden");
    }

    function handleOpenConfirmDelete(){
        confirmBoxReference.current.classList.remove("hidden");
    }

    // DELETE ITEM REQUEST
    function handleConfirm(){
        (async ()=>{
            const responseStatus = await serverRequest(`/api/owner/delete-menu-item/${item.id}/`, "DELETE", true);

            if (responseStatus === 204){
                setItem(null);
                setNewNotification("Item Deleted Successfully!", true);
            }
            else if(responseStatus === 400){
                setNewNotification("To delete, Complete the orders with this item!");
            }
            else if (responseStatus === 403){
                setNewNotification("You cannot delete this Item!");
            }
            else if (responseStatus === 404){
                setNewNotification("Item Not Found!");
            }
            else{
                console.log("Error: ");
                setNewNotification();
            }
        })();
    }


    useEffect(()=>{
        window.scrollTo(0,0);
        // REQUEST TO GET ITEM
        (async ()=>{
            const [data, responseStatus] = await serverRequest(`/api/owner/menu-item/${item_id}/`, "GET");

            if (responseStatus === 200){
                setItem(data);
            }
            else if (responseStatus === 404){
                setNewNotification("Item Not Found!");
            }
            else{
                console.log("Error: ", data);
                setNewNotification();
            }
        })();
    }, [])


    return (
        <>
            { item && <>
                    <ImageForm reference={imageFormReference} urlPath={`change-item-image/${item.id}/`} setData={setItem}/>
                    <ConfirmBox reference={confirmBoxReference} message="Item will be deleted permanently! Confirm to delete." handleConfirm={handleConfirm} confirmBtnText="Delete"/>
                    <ItemForm reference={itemFormReference} item={item} setItem={setItem}/>
                </>
            }
            <div className="max-w-xl m-auto">
                
                <div className="flex items-center gap-8 mb-16">
                    <IconButton iconName="arrow_back" onClick={()=>navigate(-1)} />
                    <h2 className="text-2xl font-bold">Item Detail</h2>
                </div>

                {
                    isProcessingItem ?
                        <Loading />
                    :
                        item ?
                            <>
                                {/* Buttons */}
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-16">
                                    <SecondaryButton iconName="add_photo_alternate" onClick={handleOpenImageForm}>Change Image</SecondaryButton>
                                                
                                    <SecondaryButton iconName="edit" onClick={handleOpenItemForm}>Edit</SecondaryButton>
                                    
                                    <SecondaryButton iconName="delete_forever" onClick={handleOpenConfirmDelete}>Delete</SecondaryButton>
                                </div>

                                {/* Item */}
                                <div className="flex gap-4 md:gap-8 mb-8">
                                    <img className="bg-gray-200 size-24 md:size-32 object-cover rounded-2xl" src={item.image} alt="" />

                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <VegTag isVeg={item.is_veg} />
                                            <h1 className="text-xl capitalize">{item.name.toLowerCase()}</h1>
                                        </div>

                                        <div className="flex items-center text-xl">
                                            <Icon iconName="currency_rupee" />
                                            {item.price}
                                        </div>
                                    </div>

                                </div>

                                <p className="text-lg">{item.description}</p>
                            </>
                        :
                            <TextMessage message="Item Not Found!" />
                }

            </div>
        </>
    )
}