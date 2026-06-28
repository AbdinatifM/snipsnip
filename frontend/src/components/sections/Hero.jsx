import React, { useState } from 'react'
import { RiClipboardFill, RiScissorsFill } from '@remixicon/react'
import { api } from '../../api/api';
import toast from 'react-hot-toast';
import { validateUrl } from '../../../../shared/validateUrl';

function Hero() {
    const [text, setText] = useState('');
    const [copyText, setCopyText] = useState(null);



    const submitUrl = async() => {
        const currentText = text;
        const isValid = validateUrl(currentText);
        console.log("Reached", text, isValid);
        if (currentText === '') return;

        if (!isValid) { 
            toast.error("Invalid URL") 
            return; 
        }

        console.log('here');

        try {
            const res = await api.post("/urls/shorten", {
                originalUrl: currentText
            })
            console.log(res);
            setCopyText(`http://localhost:4000/${res.data.shortCode}`);
        } catch (error) {
            setCopyText(null);
        }

    }

    const copyToClipboard = async() => {
        if (copyText === null) return;
        try {
            await navigator.clipboard.writeText(copyText);
            
            toast.success("Copied To Clipboard");
        } catch (error) {
            console.log("failed to copy text: ", error);
            toast.error("failed to copy to your clipboard")
        }
    }


  return (
    <div>
        <div className='flex items-center text-white mb-5'>
            <h2 className='text-4xl mr-2 font-bold'>SNIPSNIP</h2>
            <RiScissorsFill 
                size={36}
            />
            <p className='text-[#666666]'>URL SHORTENER</p>
        </div>
        <div className='bg-white px-5 py-5 rounded-md w-[50rem] flex gap-2 mb-5'>
            <input className='flex-1 focus:outline-none' type="text" name="" id=""  placeholder='Paste your long url (https://example.com/very-long-link)'
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                    console.log(e);
                    if (e.key === 'Enter') {
                        submitUrl();
                    }
                }}
            />
            <button className='bg-blue-200 px-2 text-[#666666] rounded-md'
                onClick={submitUrl}
            >
                Short Link
            </button>
        </div>

        {copyText !== null && 
            <div className='bg-white px-5 py-4 rounded-md w-[25rem] flex gap-2 mx-auto' >
                <input className='flex-1 focus:outline-none' type="text" name="" id="" 
                    value={copyText}
                readOnly/>
                <button onClick={copyToClipboard}>
                    <RiClipboardFill 
                        className='text-[#666666]'
                    />
                </button>
            </div>
        }
    </div>
  )
}

export default Hero