document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("Gamelandia JS imported successfully!");
  },
  false
);

function searchGames() {
  let input = document.getElementById("search-game");
  let inputCapitalized = input.value.toUpperCase();
  let table = document.getElementById("list-gamerooms");
  let tableRows = table.getElementsByTagName("tr");
  let tableData;
  let txtValue;

  for (let i = 0; i < tableRows.length; i++) {
    tableData = tableRows[i].getElementsByTagName("td")[0];

    if (tableData) {
      txtValue = tableData.textContent || tableData.innerText;
      if (txtValue.toUpperCase().indexOf(inputCapitalized) > -1) {
        tableRows[i].style.display = "";
      } else {
        tableRows[i].style.display = "none";
      }
    }
  }
}
