export default class Modal {
    
    static openModal(modal) {
    const overlay = document.querySelector('.overlay')
    if (modal == null) return
        overlay.classList.add('active');
        modal.classList.add('active');
    }

    static closeModal(modal) {
    const overlay = document.querySelector('.overlay')
    if (modal == null) return
        overlay.classList.remove('active');
        modal.classList.remove('active');
    }
}