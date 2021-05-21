import React from 'react'
import {Init} from './hooks/current-user.hook'
import {Modal} from './parts/modal'
import {useRecoilValue} from 'recoil'
import {mintNFTs} from "./flow/mint-nft"


const refOpen = (ref) =>{
    if (ref.current)
        ref.current.open()
}

const useMintForm = (callback) => {
    
    let [inputs, setInputs] = React.useState({})
    
    const handleSubmit = (event) => {
        if(event) 
            event.preventDefault()
        callback(inputs);
    }   

    const handleInput = (event) => {
        event.persist() 
        setInputs(inputs => ({...inputs, [event.target.name]: event.target.value}))
    }

    const handleFile = (event) => {
        event.persist()
        if(event.target.files.length > 0) {
            let reader = new FileReader()
            reader.readAsDataURL(event.target.files[0])
            // This onload bad boi will get called when ReadAsDataURL is finished 
            // Like this should be easy but not very clear in JS
            reader.onload = () => {
                setInputs({...inputs, [event.target.name]: reader.result})
            }
        }
    }

    return {
        handleSubmit,
        handleInput,
        handleFile,
        inputs
    }
}


export function MinterButton () {
    let ref = React.useRef(null)
    let {inputs, handleSubmit, handleInput, handleFile} = useMintForm(mintNFTs)

    return useRecoilValue(Init) ? (
        <div>
        <Modal ref={ref}>
            <form onSubmit={handleSubmit}>
                <label className='meta-label'>Quantity:  </label>
                <input value={inputs.quantity} name="quantity" onChange={handleInput}></input>
                <br/>
                <label>Name: </label>
                <input value={inputs.name} name="name" onChange={handleInput}></input>
                <br/>
                <input type="file" value={inputs.img} name="ximg" onChange={handleFile} id="input" accept=".jpg,.png" />
                <button type="submit">Mint NFTs</button> 
                <img id="tmp"></img>
            </form>
        </Modal>
      <button id="init-mint-button" onClick={ () =>  refOpen(ref) }>Mint</button> 
    </div>
    ): null
}

export default MinterButton;