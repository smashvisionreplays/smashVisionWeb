	import { format, subDays, startOfWeek, addDays } from 'date-fns'; // Para manipulación de fechas

	await loadClubs();
	loadTimes();
	loadDates();

	// Función para obtener fechas específicas
function getSpecificDates() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (domingo) a 6 (sábado)
    const mondayThisWeek = startOfWeek(today, { weekStartsOn: 1 }); // Lunes de esta semana
    const daysOfWeek = ['0', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const diasSemana = ['0', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const dates = [];

    // Itera sobre los días de la semana
    for (let i = 1; i <= 7; i++) { // 1 (lunes) a 7 (domingo)
        if (dayOfWeek == 0) { // Si es domingo
            dates.push({ date: addDays(mondayThisWeek, i - 1), day: daysOfWeek[i], dia: diasSemana[i] });
        } else { // Para cualquier otro día que no sea domingo
            if (i <= dayOfWeek) {
                // Días antes de hoy (días de esta semana)
                dates.push({ date: addDays(mondayThisWeek, i - 1), day: daysOfWeek[i], dia: diasSemana[i] });
            } else {
                // Hoy y días después de hoy (días de la semana pasada)
                dates.push({ date: subDays(mondayThisWeek, 8 - i), day: daysOfWeek[i], dia: diasSemana[i] });
            }
        }
    }
    // Formatea las fechas a "Día de la semana - dd/MM/yyyy"
    return dates.map(({ date, day, dia }) => ({ label: `${dia} - ${format(date, 'dd/MM/yyyy')}`, value: day }));

}

	async function loadClubs(){
		const {data,error} = await actions.getClubs();
		//console.log("clubs are in front:", data)
		// if (data && !error) {
		// 	const clubDropdown=document.getElementById("club");			
		// 	data.map((item: { Name: string | undefined; ID: string | undefined; }) => {
		// 		//console.log("item:", item)
		// 		clubDropdown?.appendChild(new Option(item.Name, item.ID)).cloneNode(true)});
		// }
	}

	function loadDates() {
		let dates = getSpecificDates();
		const dateDropdown = document.getElementById("date");
		if (!dateDropdown) return; // Check if dropdown exists

		// Map to options format if needed
		const options = dates.map(({ label, value }) => ({ label, value }));

		// Clear existing options
		dateDropdown.innerHTML = "";

		// Append new options to the dropdown
		options.forEach(({ label, value }) => {
			const option = new Option(label, value);
			dateDropdown.appendChild(option);
		});
	}

	async function loadCourts(){
		const courtsDropdown=(document.getElementById("court"));
		while (courtsDropdown?.firstChild) {
			courtsDropdown.removeChild(courtsDropdown.firstChild);
		}

		// const club=(document.getElementById("club") as HTMLInputElement).value;
		const {data,error} = await actions.getClubCourts({club:club});
		//console.log("courts are in front:", data)
		if (data && !error) {	
			const courtsNumber=data[0].Courts_Number;	
			console.log("courtsNumber is", courtsNumber)
			for(var i=1;i<=courtsNumber;i++){
				//console.log("appending child", i)
				courtsDropdown?.appendChild(new Option(i.toString(), i.toString())).cloneNode(true);
			}
		}
	}

	function loadTimes(){
		const timeDropdown=(document.getElementById("time"));
		while (timeDropdown?.firstChild) {
			timeDropdown.removeChild(timeDropdown.firstChild);
		}
		let lista = [];

		for (let hora = 0; hora < 24; hora++) {
			for (let minuto = 0; minuto < 60; minuto += 30) {
				let siguienteHora = (hora + (minuto + 30 >= 60 ? 1 : 0)) % 24;
				let siguienteMinuto = (minuto + 30) % 60;

				let label = `${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')} - ${siguienteHora.toString().padStart(2, '0')}:${siguienteMinuto.toString().padStart(2, '0')}`;
				let value = `${hora.toString().padStart(2, '0')}_${minuto === 0 ? 0 : 1}`;

				//lista.push({ label, value });
				console.log("appending:",)
				timeDropdown?.appendChild(new Option(label, value)).cloneNode(true);
			}
		}
}

	//Rethink here, i dont think is needed to a db query for this, the initial query of getting clubs should store the clubname, id, courts to be used to dynamically change the state of the dropdown
	// (document.getElementById("club") as HTMLInputElement).addEventListener("change", async ()=>{await loadCourts()});