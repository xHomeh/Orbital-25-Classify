async function fetchModuleData(courseCodes) {
    const urlTemplate = "https://api.nusmods.com/v2/2023-2024/modules/";
  
    try {
      const fetchPromises = courseCodes.map(code =>
        fetch(`${urlTemplate}${code}.json`).then(response => {
          if (!response.ok) {
            throw new Error(`Failed to fetch module: ${code}`);
          }
          return response.json();
        })
      );
  
      const moduleDataArray = await Promise.all(fetchPromises);
      return moduleDataArray;
  
    } catch (error) {
      console.error("Error fetching modules:", error);
      return [];
    }
  }
  

function generateRandom(apiDataArray, semester) {
  const results = apiDataArray.map(modData => modData.semesterData)
  const semData = results.map(yearData => yearData[semester - 1]);
  const timetableData = semData.map(dict => dict.timetable);
  return timetableData;
}






  const modules = ["CS1101S", "MA2001", "IS1108"];

  // fetchModuleData(modules).then(data => {
  //   console.log("Fetched Modules:", data);
  // });

  fetchModuleData(modules).then(data => generateRandom(data, 1)).then(data => console.log(data));
