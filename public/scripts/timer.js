function now(){
    let date = new Date();
    let day = date.getDate();
    let monthIndex = date.getMonth() + 1;
    let year = date.getFullYear();
    daysandmonth = JSON.stringify({'day': day, 'month': monthIndex, "year": year});
    if (!localStorage.getItem('date')) localStorage.setItem('date', daysandmonth);

}
function future(){
    let date = new Date();
    let day = date.getDate();
    let monthIndex = date.getMonth() + 1;
    let year = date.getFullYear();
    let datef = {'day': day, 'month': monthIndex, "year": year};
    let datenow = JSON.parse(localStorage.getItem('date'));
    pos1 = datef.day;
    pos2 = datenow.day;
    pos11 = datef.month;
    pos22 = datenow.month;
    pos3 = datef.year;
    pos33 = datenow.year;
    if (pos1 > pos2 + 1 || pos11 > pos22 || pos3 > pos33){
        localStorage.clear();
        now();
    }
}
if (localStorage.getItem("date")) future();