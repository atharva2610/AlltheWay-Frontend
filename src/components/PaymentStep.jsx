import { PrimaryButton, SecondaryButton } from "../components/Button";
import Icon from "../components/Icon";

export default function PaymentStep({setCurrentStep, handleConfirmOrder, paymentMode, setPaymentMode, setSelectedLocationId}) {

    function handleGoBack(){
        setSelectedLocationId(null);
        setPaymentMode(null);
        setCurrentStep(prev => prev -= 1)
    }

    return ( 
        <div className="">
            <h2 className="mb-8 text-xl md:text-2xl font-bold">Select Payment Mode</h2>

            {/* Payment Mode Option */}
            <div className="flex mb-4">
                <input className="peer appearance-none" type="radio" name="paymentMode" value="online" id="onlinePayment" onChange={e => setPaymentMode(e.target.value)} />
                <label className="cursor-pointer w-full p-4 text-lg md:text-xl border border-gray-300 rounded-[36px] peer-checked:border-emerald-500" htmlFor="onlinePayment">Pay Online</label>
            </div>

            <div className="flex mb-4">
                <input className="peer appearance-none" type="radio" name="paymentMode" value="cod" id="codPayment" onChange={e => setPaymentMode(e.target.value)} />
                <label className="cursor-pointer w-full p-4 text-lg md:text-xl border border-gray-300 rounded-[36px] peer-checked:border-emerald-500" htmlFor="codPayment">Cash On Delivery</label>
            </div>


            {/* Previous & Next Buttons */}
            <div className="flex justify-between my-8">
                <SecondaryButton iconName="arrow_back" onClick={handleGoBack}>Back</SecondaryButton>

                {
                    paymentMode && <PrimaryButton iconName="done" bgColor="bg-emerald-500" textColor="text-white" onClick={()=>handleConfirmOrder()}>Confirm</PrimaryButton>
                }
            </div>
        </div>
     );
}