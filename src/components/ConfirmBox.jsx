import { PrimaryButton, SecondaryButton } from "./Button";
import Modal from "./Modal";

export default function ConfirmBox({reference, message, handleConfirm, confirmBtnText="Yes", confirmBtnColor="bg-red-500"}) {

    function handleClose(){
        reference.current.classList.add("hidden");
    }

    return ( 
        <Modal reference={reference}>
            <>
                <h1 className="text-xl md:text-2xl mb-12">{message}</h1>
                
                <div className="grid grid-cols-2 gap-4">
                    <SecondaryButton iconName="close" onClick={handleClose}>Close</SecondaryButton>
                    <PrimaryButton bgColor={confirmBtnColor} textColor="text-white" iconName="done" onClick={()=>{
                        handleConfirm();
                        handleClose();
                    }}>{confirmBtnText}</PrimaryButton>
                </div>
            </>
        </Modal>
     );
}