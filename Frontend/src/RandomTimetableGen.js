
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

function getDistinct(value, index, array) {
  return array.indexOf(value) === index;
}

// Use this by doing getTimetableData(apiData, semester).map(getClassTypes)
// function getClassTypes(courseArrayOfDicts) {
//   return courseArrayOfDicts.map(dict => dict.lessonType).filter(getDistinct);
// }

// Get the relevant semester data which contains class timings from the API data 
function getAcadYearData(apiDataArray){
  return apiDataArray.map(modData => modData.semesterData);
}

// Filter out the sem we want ie sem 1 or 2
function getSemData(apiDataArray, semester) {
  return getAcadYearData(apiDataArray).map(yearData => yearData[semester - 1]);
}

// Get the list of class timings 
function getTimetableData(apiDataArray, semester) {
  return getSemData(apiDataArray, semester).map(dict => dict.timetable);
}

// Get the type of lessons there is in the mod, ie tutorial lecture etc. 
function getClassTypes(apiDataArray, semester) {
  return getTimetableData(apiDataArray, semester).map(arrOfDicts => arrOfDicts.map(dict => dict.lessonType).filter(getDistinct));
}


/*
get the lesson types from each mod, ie recitation, tutorial, lecture. 
Map each lesson type to the possible timings, then sort by least lessons so less likely to clash (for efficiency)
Shuffle the array of timings for randomisation 
Use recursive backtracking to get the first possible combination

Possible issues: If there is no valid combination it will run thru every combination which will likely take quite long
*/

function generateRandom(apiDataArray, semester) {
  const timetableData = getTimetableData(apiDataArray, semester);
  const classTypes = getClassTypes(apiDataArray, semester);
  
  const classTypeWithTimings = [];

  for (let i = 0; i < classTypes.length; i++) {
    const classTimesForModuleAtIndexI = timetableData[i];
    const temp = [];
    for (let j = 0; j < classTypes[i].length; j++) {
      temp[j] = classTimesForModuleAtIndexI.filter(dict => dict.lessonType == classTypes[i][j]); 
    }

    classTypeWithTimings[i] = temp;
  }

  return classTypeWithTimings;
}



  const modules = ["CS1101S", "MA2001", "IS1108"];

  // fetchModuleData(modules).then(data => {
  //   console.log("Fetched Modules:", data);
  // });

  // fetchModuleData(modules).then(x => console.log(x));

  // get class types

  fetchModuleData(modules).then(data => getClassTypes(data, 1)).then(x => console.log(x));

  fetchModuleData(modules).then(data => generateRandom(data, 1)).then(x => console.log(x));

  // fetchModuleData(modules).then(x => getTimetableData(x, 1)).then(data => console.log(data));

