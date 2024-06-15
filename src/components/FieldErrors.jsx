export default function FieldErrors({errors}) {
    
    return ( 
        errors ?
            <ul className="px-4">
                {
                    errors.non_field_errors ? errors.non_field_errors.map(error => <li key={error} className="mt-2 text-sm tracking-wider text-red-500 font-bold">{error}</li>)
                    :
                    errors.map(error => <li key={error} className="mt-2 text-sm tracking-wider text-red-500 font-bold">{error}</li>)
                }
            </ul>
        :
            <></>
     );
}