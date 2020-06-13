/* eslint-disable */
function listProperties(kod) {
  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const material = JSON.parse(xhr.responseText);
      const formattedMaterial = `kurzusok: ${material.kurzusok}, szeminarok: ${material.szeminarok}, laborok: ${material.laborok}`;
      document.getElementById(kod).innerHTML = formattedMaterial;
    }
  };

  xhr.open('GET', `/api/materials/${kod}?properties=${true}`);
  xhr.send();
}
