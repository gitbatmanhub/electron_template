window.addEventListener('load', () => {
    const button = document.getElementById('loadFile');
    const loadSucursales = document.getElementById('loadSucursales');
    const listOfSucursales = document.getElementById('listOfSucursales')!;
    button?.addEventListener('click', async () => {
        const content = await window.api.file.open();
        console.log(content)
    });

    loadSucursales?.addEventListener('click', async () => {
        await window.api.sucursales.get_sucursales().then(sucursales => {
            listOfSucursales.innerHTML = '<option value="">Selecciona un usuario</option>';

            sucursales.forEach(sucursal => {
                console.log(sucursal)
                const opcion = document.createElement('option');
                opcion.value = sucursal.idSucursal;
                opcion.innerText = sucursal.nombre;
                // opcion.addEventListener('click', async () => {
                //     await loadServices(sucursal.idSucursal);
                // })
                listOfSucursales.appendChild(opcion);
                listOfSucursales.addEventListener('change', async () => {
                    await loadServices(sucursal.idSucursal);

                })
            });


        }).catch(error => console.log(error));

    })
})


async function loadServices(idSucursal: string) {
    await window.api.servicios_sucursales.get_servicios_sucursales().then(sucursales => {
        console.log(sucursales)
    })
}
