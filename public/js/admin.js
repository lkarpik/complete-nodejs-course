const deleteButtons = [...document.querySelectorAll('button.btn')].filter(el => el.textContent === 'Delete');


const deleteProduct = (e) => {
    e.preventDefault();
    const prodId = e.target.parentNode.querySelector('[name=productId]').value;
    const csrf = e.target.parentNode.querySelector('[name=_csrf]').value;

    const productElement = e.target.closest('article');

    fetch('/admin/product/' + prodId, {
        method: 'DELETE',
        headers: {
            'csrf-token': csrf
        }
    }).then(result => {
        const data = result.json()
        console.log(data);
        return data;

    }).then(result => {
        productElement.remove();
        console.log(result);
    }).catch(err => {
        console.log(err);
    });
}

deleteButtons.forEach(el => {
    el.addEventListener('click', deleteProduct)
});