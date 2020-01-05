const deleteProduct = (e) => {
    e.preventDefault();
    const prodId = e.target.parentNode.querySelector('[name=productId]').value;
    console.log(prodId);
}

const deleteButtons = [...document.querySelectorAll('button.btn')].filter(el => el.textContent === 'Delete');

deleteButtons.forEach(el => {

    el.addEventListener('click', deleteProduct)
})