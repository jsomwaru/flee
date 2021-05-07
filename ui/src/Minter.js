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
        if(event) event.preventDefault()
    }   

    const handleInput = (event) => {
        event.persist() 
        setInputs(inputs => ({...inputs, [event.target.name]: event.target.value}))
        callback();
    }

    return {
        handleSubmit,
        handleInput,
        inputs
    }
}


export function MinterButton () {
    let ref = React.useRef(null)
    let fileRef = React.useRef(null)
    let {inputs, handleSubmit, handleInput} = useMintForm(mintNFTs)

    return useRecoilValue(Init) ? (
        <div>
        <Modal ref={ref}>
            <form onSubmit={handleSubmit}>
                <label className='meta-label'>Price  </label>
                <input value={inputs.price} onChange={handleInput} ></input>
                <br/>
                <label className='meta-label'>Quantity  </label>
                <input value={inputs.quantity} onChange={handleInput}></input>
                <br/>
                <label>Name </label>
                <input value={inputs.name} onChange={handleInput}></input>
                <br/>
                <input type="file" ref={fileRef} id="input" multiple/>
                <button type="submit">Mint</button> 
            </form>
        </Modal>
      <button id="init-mint-button" onClick={() =>  refOpen(ref) }>Mint</button> 
    </div>
    ): null
}

export default MinterButton;