require("colors");
const fs = require("fs");
const templates = require("./templates");

const componentName = process.argv[2];
const componentPath = process.argv[3];

if (!componentName) {
  console.error("Please supply a valid component name".red);
  process.exit(1);
}

console.log("Creating Component Templates with name: " + componentName);

let componentDirectory
if (!componentPath) {
  componentDirectory = `./src/components/${componentName}`;
} else {
  if (!fs.existsSync(`./src/${componentPath}`)) {
    fs.mkdirSync(`./src/${componentPath}`)
  }

  componentDirectory = `./src/${componentPath}/${componentName}`;
}

if (fs.existsSync(componentDirectory)) {
  console.error(`Component ${componentName} already exists.`.red);
  process.exit(1);
}

fs.mkdirSync(componentDirectory);

const generatedTemplates = templates.map((template) => template(componentName));

generatedTemplates.forEach((template) => {
  if (template.type === 'style') {
    fs.writeFileSync(
      `${componentDirectory}/${componentName}${template.extension}`,
      template.content
    )
  } else if (template.type === 'index') {
    fs.writeFileSync(
      `${componentDirectory}/index${template.extension}`,
      template.content
    );
  } else {
    fs.writeFileSync(
      `${componentDirectory}/${componentName}${template.extension}`,
      template.content
    );
  }
});

console.log(
  "Successfully created component under: " + componentDirectory.green
);
