import { PrimaryButton, Loading, FormErrorMessage } from "../components";


export default function Form({children, handleFormSubmit, formTitle=null, iconName="done", btnText="Save", isProcessing=false, errors=null}){

    return (
        <form onSubmit={handleFormSubmit} className="w-full max-w-md flex flex-col gap-8 m-auto">
                
            {formTitle && <h1 className="mb-4 text-center text-2xl font-bold">{formTitle}</h1>}

            {
                errors?.non_field_errors ? errors.non_field_errors.map(error => <FormErrorMessage key={error} message={error}/>) : <></>
            }

            {children}


            {
                isProcessing ?
                    <Loading />
                :
                    <PrimaryButton type="submit" iconName={iconName} onClick={()=>{window.scrollTo(0,0)}}>{btnText}</PrimaryButton>
            }

        </form>
    )
}