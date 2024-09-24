export default function SuccessBox({children})
{
    return(
        <div className="text-center bg-green-100 p-4 border border-green-300">
        {children}
      </div>  
    );
}