import { baseURL } from "../configrations/backendConfig";

export default async function changeImage(token, fdata, urlPath, setData, setIsProcessing, setErrors, setGlobalNotification){
    setIsProcessing(true);
    setErrors(null);

    try {
        const response = await fetch(baseURL+"/api/owner/"+urlPath, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: fdata
        });

        const data = await response.json();

        if (response.status === 200){
            setData(data);
            setIsProcessing(false);
            setGlobalNotification({message: "Image Updated!", success: true});
            return;
        }
        else if (response.status === 400){
            setErrors(data);
        }
        else{
            setGlobalNotification({message: "An error occured! Try again later.", success: false});
        }
        console.log("Error: ", data);
    }
    catch (error) {
        console.log("Server Error: ",error);
        setGlobalNotification({message: "Unable to connect with Server!", success:false});
    }
    setIsProcessing(false);
}