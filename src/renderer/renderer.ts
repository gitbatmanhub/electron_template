window.addEventListener("load", () => {
    const button = document.getElementById("loadFile");
    const loadSucursales = document.getElementById("loadSucursales");
    const listOfSucursales = document.getElementById(
        "listOfSucursales"
    ) as HTMLSelectElement;

    button?.addEventListener("click", async () => {
        const content = await window.api.file.open();
        console.log(content);
    });

    listOfSucursales.innerHTML =
        '<option value="">Selecciona una sucursal</option>';

    loadSucursales?.addEventListener("click", async () => {
        try {
            const sucursales = await window.api.sucursales.get_sucursales();

            listOfSucursales.innerHTML =
                '<option value="">Selecciona una sucursal</option>';

            sucursales.forEach((sucursal) => {
                const opcion = document.createElement("option");

                opcion.value = sucursal.idSucursal;
                opcion.innerText = sucursal.nombre;

                listOfSucursales.appendChild(opcion);
            });
        } catch (error) {
            console.error("Error cargando sucursales:", error);
        }
    });

    listOfSucursales.addEventListener("change", async () => {
        const idSucursal = listOfSucursales.value;

        if (!idSucursal) return;

        console.log("Sucursal seleccionada:", idSucursal);

        try {
            const servicios =
                await window.api.servicios.getBySucursal(
                    idSucursal
                );

            console.log("Servicios:", servicios);
        } catch (error) {
            console.error("Error cargando servicios:", error);
        }
    });
});