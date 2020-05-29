import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
 
import langConfig from '../config/lang';

import '../less/tiermodal.less';

const customStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)'
    },
    content: {
        position: 'absolute',
        color: 'white',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        minWidth: "300px",
        transform: 'translate(-50%, -50%)',
        boxShadow: '0px 4px 1px black',
        border: '1px solid #202225',
        background: '#2f3136',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
        borderRadius: '20px',
        outline: 'none',
        padding: '20px'
    }
};
 
class AddItemModal extends React.Component<{
    addItemCallBack: Function
}, {
    modalIsOpen?: boolean,
    itemName?: string,
    itemThumbnail?: string,
    itemLink? : string
}>
{
    constructor(props)
    {
        super(props);

        this.state = {
            modalIsOpen: false
        };

        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    openModal()
    {
        this.setState({ modalIsOpen: true });
    }

    afterOpenModal()
    {
    }

    closeModal()
    {
        this.setState({ 
            modalIsOpen: false,
            itemThumbnail: undefined
        });
    }

    handleInputChange(event: Event)
    {
        const target = event.target as HTMLInputElement;
        const value: string | boolean = target.type === 'checkbox' ? target.checked : target.value;
        const name: string = target.name;

        this.setState({
            [name]: value 
        });
    }

    handleThumbnailUpload(event: Event)
    {
        const file = (event.target as HTMLInputElement).files[0];
        const reader = new FileReader();
      
        reader.addEventListener("load", () => {
            var imageData = reader.result as string;

            this.setState({
                itemThumbnail: imageData
            });

        }, false);
      
        if (file)
        {
            reader.readAsDataURL(file);
        }
    }

    processSubmit(event)
    {
        this.props.addItemCallBack(this.state.itemName, this.state.itemThumbnail, this.state.itemLink);
        
        event.preventDefault();
        this.closeModal();
    }

    render() {
        return (
            <div>
                <Modal
                    isOpen={this.state["modalIsOpen"]}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    style={customStyles}
                    contentLabel={langConfig.appControls.modals.addModal.modalTitle}>
                        
                    <div className="tl-modal">
                        <span className="tl-modal-title">{langConfig.appControls.modals.addModal.modalTitle}</span>
                        <button className="tl-modal-close tl-modal-bttn" onClick={this.closeModal}>{langConfig.appControls.cancel}</button>

                        <form onSubmit={this.processSubmit.bind(this)}>
                            <div className="tl-modal-field">
                                <label>{langConfig.appControls.modals.addModal.itemName}*</label><br />
                                <input required={true} className="tl-modal-input" name="itemName" onChange={this.handleInputChange.bind(this)} />
                            </div>

                            <div className="tl-modal-field">
                                <label>{langConfig.appControls.modals.addModal.itemThumbnail}</label><br />
                                <input className="tl-modal-input" type="file" onChange={this.handleThumbnailUpload.bind(this)} /><br />
                                <img src={this.state.itemThumbnail} className="tl-modal-thumbnail" alt=""></img>
                            </div>

                            <div className="tl-modal-field">
                                <label>{langConfig.appControls.modals.addModal.itemLink}</label><br />
                                <input className="tl-modal-input" name="itemLink" onChange={this.handleInputChange.bind(this)} />
                            </div>

                            <div className="tl-modal-field">
                                <em>{langConfig.appControls.modals.addModal.requiredInfo}</em>
                            </div>

                            <input type="submit" value={langConfig.appControls.modals.addModal.confirmButton} />
                        </form>
                    </div>

                </Modal>
            </div>
        );
    }
}

export default AddItemModal;