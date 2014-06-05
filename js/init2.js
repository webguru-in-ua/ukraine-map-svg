var ColorLuminance = function(hex, percent) {
  // strip the leading # if it's there
  hex = hex.replace(/^\s*#|\s*$/g, '');

  // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
  if (hex.length == 3) {
    hex = hex.replace(/(.)/g, '$1$1');
  }

  var r = parseInt(hex.substr(0, 2), 16),
    g = parseInt(hex.substr(2, 2), 16),
    b = parseInt(hex.substr(4, 2), 16);

  return '#' +
    ((0 | (1 << 8) + r + (256 - r) * percent / 100).toString(16)).substr(1) +
    ((0 | (1 << 8) + g + (256 - g) * percent / 100).toString(16)).substr(1) +
    ((0 | (1 << 8) + b + (256 - b) * percent / 100).toString(16)).substr(1);
}


// Randomize with border
var getRandomSpan = function (border) {
  return Math.floor((Math.random() * border) + 1) - border;
}


// Calc sum in regions
var isVacanciesView = true,
  mapColor = '#e95b2b',
  regions = new Array(),
  max = 0,
  min = 0;

mapColor = isVacanciesView ? '#006eb7' : mapColor;

// Group city values to region
for (var i = 0; i < regionList.length; i++) {
  regions[i] = 0;
  for (var city in citiesList) {
    if (i == citiesList[city].region) {

      // vacancies
      if (isVacanciesView)
        regions[i] += Math.floor(citiesList[city].count / 12000) + getRandomSpan(10);
      else
        regions[i] += citiesList[city].corrected;
    }
  }
  // Getting max value
  if (max < regions[i]) max = regions[i];
  // Getting min value
  if (min == 0) min = regions[i];
  if (min > regions[i]) min = regions[i];
}


var r = Raphael('map', 960, 675),
  attributes = {
    fill: '#fff',
    stroke: ColorLuminance(mapColor, 0),
    'stroke-width': 1,
    'stroke-linejoin': 'round',
    transform: "s0.7,0.7,0,0"
    //transform: "matrix(1.25,0,0,-1.25,0,675)"
  },
  arr = new Array();


var lastColor;

for (var region in paths) {
  var obj = r.path(paths[region].path);

  var koef = 0;

  if (paths[region].score !== 'undefined') {
    koef = 90-(regions[paths[region].id] - min) / (max - min)*90;
    attributes.fill = ColorLuminance(mapColor, koef);

  }


  attributes.title = paths[region].name + '\n';
  attributes.title += (isVacanciesView) ? 'Вакансий: ' : 'Тайных покупателей: ';
  attributes.title += regions[paths[region].id];

  obj.attr(attributes);
  arr[obj.id] = attributes.fill;


  obj
    .hover(function () {
      lastColor = this.attr('fill');
      //alert();
      this.animate({
        fill: '#fff'
      }, 300);
    }, function () {
      this.animate({
        fill: arr[this.id]
      }, 300);
    })
    .click(function () {
      alert(this.attr('fill'));
    });
}
