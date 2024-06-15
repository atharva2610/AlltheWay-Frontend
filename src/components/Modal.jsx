import { IconButton } from "./Button";

export default function Modal({children, reference, width="max-w-lg"}) {
  
      function handleClose(){
          reference.current.classList.add("hidden");
      }

    return (
        <section ref={reference} className="hidden z-30 fixed top-0 left-0 h-full w-full bg-[rgba(0,0,0,0.5)] backdrop-blur flex justify-center items-center px-2">
            <div className={`relative bg-white max-h-[80%] ${width} w-full px-4 md:px-8 py-8 rounded-[36px] overflow-y-auto`}>
                <IconButton onClick={handleClose} iconName="close" extraCSS="ml-auto mb-4" />
                {children}
            </div>
        </section>
    );
}