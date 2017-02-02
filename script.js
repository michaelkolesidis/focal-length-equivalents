var formats;
var format35mm;

function updateOutputs(e) {
  let largestFormat = formats[formats.length - 1];
  let sliderValue = largestFormat.normalFocalLength(); //default

  if (e && e.target.value) {
    sliderValue = parseInt(e.target.value);
  }

  for (var i = formats.length - 1; i >= 0; i--) {
    let outputElement = document.getElementById(
      _domIDForFormatName(formats[i].name)
    );

    outputElement.value =
      Math.round(
        formats[i].equivalentToFocalLengthInFormat(sliderValue, largestFormat)
      ) + ' mm';
  }
}

function init() {
  let form = document.getElementsByTagName('form')[0];
  form.style.display = 'initial';

  form.addEventListener('input', updateOutputs);

  format35mm = new ImagingFormat('35mm', 36, 24);
  format35mm.setCommonFocalLengths([
    10,
    16,
    21,
    24,
    28,
    35,
    format35mm.diagonalInMm(),
    50,
    85,
    100,
    135,
    200,
  ]);

  formats = [
    new ImagingFormat('Micro 4/3', 18, 13.5),
    new ImagingFormat('APS-C', 23.7, 15.6),
    format35mm,
    new ImagingFormat('Fuji GFX', 43.8, 32.9),
    new ImagingFormat('6x4.5', 56, 42),
    new ImagingFormat('6x6', 56, 56),
    new ImagingFormat('6x7', 56, 70),
    new ImagingFormat('6x8', 56, 76),
    new ImagingFormat('6x9', 56, 84),
    new ImagingFormat('4x5', 121, 97),
    new ImagingFormat('8x10', 254, 203),
  ].sort(function (formatA, formatB) {
    if (formatA.diagonalInMm() < formatB.diagonalInMm()) return -1;
    if (formatA.diagonalInMm() > formatB.diagonalInMm()) return 1;
    return 0;
  });

  _addUIElementsForFormatsToForm(formats, form);
  _initRangeSlider();
  _initTableRowListeners();

  _registerServiceWorker();
}

function _addUIElementsForFormatsToForm(formats, form) {
  let template = document.getElementById('formatOutput');
  let tableBody = document.querySelector('form > table > tbody');

  formats.forEach(function (format, index, array) {
    let newformatOutput = document.importNode(template.content, true);

    newformatOutput.querySelector('label').textContent = format.name;
    newformatOutput
      .querySelector('label')
      .setAttribute(
        'title',
        `Dimensions: ${format.widthInMm} x ${format.heightInMm} mm`
      );
    newformatOutput
      .querySelector('output')
      .setAttribute('id', _domIDForFormatName(format.name));

    if (format.name === format35mm.name) {
      newformatOutput
        .querySelector('tr')
        .setAttribute('class', 'reference-format');
    }

    tableBody.appendChild(newformatOutput);
  });
}

function _initRangeSlider() {
  let largestFormat = formats[formats.length - 1];
  let focalLengthSlider = document.getElementById('focal-length');

  focalLengthSlider.setAttribute(
    'max',
    Math.round(largestFormat.equivalentToFocalLengthInFormat(200, format35mm))
  );
  focalLengthSlider.value = largestFormat.normalFocalLength();

  let datalist = document.getElementById('popular-focal-lengths');

  format35mm.commonFocalLengths.forEach(function (focalLength, index, array) {
    datalist.insertAdjacentHTML(
      'beforeend',
      `<option label="ƒ=${Math.round(
        focalLength
      )}mm in 35mm format">${Math.round(
        largestFormat.equivalentToFocalLengthInFormat(focalLength, format35mm)
      )}</option>`
    );
  });
}

function _initTableRowListeners() {
  let tableRows = document.querySelectorAll('form > table > tbody > tr');

  tableRows.forEach(function (tr, index, array) {
    tr.addEventListener('click', function () {
      tableRows.forEach(function (trInner) {
        if (trInner !== tr) {
          trInner.classList.remove('selected');
        }
      });
      tr.classList.toggle('selected');
    });
  });
}

function _domIDForFormatName(name) {
  return `result_${name.replace('.', '').replace(' ', '').toLowerCase()}`;
}

function _registerServiceWorker() {
  if (navigator.serviceWorker && !navigator.serviceWorker.controller) {
    navigator.serviceWorker.register('/serviceworker.js');
  }
}

window.onload = function () {
  init();
  updateOutputs();
};
