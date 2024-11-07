document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
});

console.log("%cWarning!", "color: red; font-size: x-large");
console.log("Modifying code here may result in errors.");

document.addEventListener("keydown", function (e) {
    if (e.key === "F12" || (e.ctrlKey && e.shiftKey && e.key === "I")) {
        e.preventDefault();
    }
});