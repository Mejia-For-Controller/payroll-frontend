interface closebuttonrequirements {
    onClose:any;
}

export function CloseButton(props:closebuttonrequirements) {
    return (
        <button 
        onClick={props.onClose}
        className='absolute top-0 right-0 mt-1 mr-1'>
            <svg
        className='h-7 w-7' viewBox="0 0 24 24">
    <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
</svg>
        </button>
    )
}