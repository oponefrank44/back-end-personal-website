"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
require("dotenv/config");
const decorators_1 = require("./decorators");
const project_1 = __importDefault(require("../models/project"));
const enum_1 = require("../models/enum");
const contact_1 = __importDefault(require("../models/contact"));
const post_1 = __importDefault(require("../models/post"));
// Middleware to check for authorization token
function Authorizationrequest(req, res, next) {
    const token = req.headers.authorization;
    if (token) {
        console.log("Authorization token:", token);
        next();
    }
    else {
        res.status(401).json({
            message: "Unauthorized",
        });
    }
}
const transporter = nodemailer_1.default.createTransport({
    service: process.env.MAIL_SERVICE,
    host: process.env.HOST,
    port: 465,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.GMAIL_PASSWORD, // the app password Not your gmail password
    },
});
let RouteController = class RouteController {
    // Project route for GET and POST
    Home(req, res) {
        res.status(201).json({
            message: "projects fetched successfully",
            projects: "welcome to the page",
        });
    }
    // get projects
    Project(req, res) {
        project_1.default.find()
            .then((projects) => {
            if (projects.length === 0) {
                return res.status(404).json({
                    message: "No projects found",
                });
            }
            res.status(201).json({
                message: "projects fetched successfully",
                projects: projects,
            });
        })
            .catch((error) => {
            console.error("Error fetching projects:", error);
            res.status(500).json({
                message: "Error fetching projects",
            });
        });
    }
    // post project
    ProjectPost(req, res) {
        const { title, description, startDate, endDate, status, githubLink, websiteLink, } = req.body;
        console.log("Received project data:", req.body);
        const project = new project_1.default({
            title: title,
            description: description,
            startDate: startDate,
            endDate: endDate,
            status: status || enum_1.ModelStatus.NOTSTARTED,
            githubLink: githubLink || "",
            websiteLink: websiteLink || "",
        });
        project
            .save()
            .then((result) => {
            console.log("Project saved:", result);
            res.status(201).json({
                message: `project ${title} created successfully`,
                project: project,
            });
        })
            .catch((error) => {
            console.error("Error saving project:", error);
            res.status(500).json({
                message: "Error saving project",
            });
        });
    }
    // get project by id
    ProjectGetById(req, res) {
        const { id } = req.params;
        project_1.default.findById(id)
            .then((project) => {
            if (!project) {
                return res.status(404).json({
                    message: "Project not found",
                });
            }
            res.status(200).json({
                message: "Project fetched successfully",
                project: project,
            });
        })
            .catch((error) => {
            console.error("Error fetching project:", error);
            res.status(500).json({
                message: "Error fetching project",
            });
        });
    }
    // update project by id
    UpdateProject(req, res) {
        const { id } = req.params;
        const { title, description, startDate, endDate, status, githubLink, websiteLink, } = req.body;
        project_1.default.findByIdAndUpdate(id, {
            title: title,
            description: description,
            startDate: startDate,
            endDate: endDate,
            status: status || enum_1.ModelStatus.NOTSTARTED,
            githubLink: githubLink || "",
            websiteLink: websiteLink || "",
        })
            .then((project) => {
            if (!project) {
                return res.status(404).json({
                    message: "Project not found",
                });
            }
            res.status(200).json({
                message: `Project updated ${project.title} successfully`,
                project: project,
            });
        })
            .catch((error) => {
            console.error("Error updating project:", error);
            res.status(500).json({
                message: "Error updating project",
            });
        });
    }
    // delete Project
    DeleteProject(req, res) {
        const { id } = req.params;
        project_1.default.findByIdAndDelete(id)
            .then((project) => {
            if (!project) {
                return res.status(404).json({
                    message: "Project not found",
                });
            }
            res.status(200).json({
                message: `Project ${project.title} deleted successfully`,
                project: project,
            });
        })
            .catch((error) => {
            console.error("Error deleting project:", error);
            res.status(500).json({
                message: "Error deleting project",
            });
        });
    }
    // Post
    // contact route for GET and POST
    Post(req, res) {
        post_1.default.find()
            .then((projects) => {
            if (projects.length === 0) {
                return res.status(404).json({
                    message: "No projects found",
                });
            }
            res.status(201).json({
                message: "projects fetched successfully",
                projects: projects,
            });
        })
            .catch((error) => {
            console.error("Error fetching projects:", error);
            res.status(500).json({
                message: "Error fetching projects",
            });
        });
    }
    // post project
    CreatePost(req, res) {
        const { title, content, } = req.body;
        console.log("Received post data:", req.body);
        const post = new post_1.default({
            title: title,
            content: content
        });
        post.save()
            .then((result) => {
            console.log("Post saved:", result);
            res.status(201).json({
                message: `project ${title} created successfully`,
                post: post,
            });
        })
            .catch((error) => {
            console.error("Error saving project:", error);
            res.status(500).json({
                message: "Error saving project",
            });
        });
    }
    // get project by id
    PostGetById(req, res) {
        const { id } = req.params;
        post_1.default.findById(id)
            .then((post) => {
            if (!post) {
                return res.status(404).json({
                    message: "Project not found",
                });
            }
            res.status(200).json({
                message: "Project fetched successfully",
                post: post,
            });
        })
            .catch((error) => {
            console.error("Error fetching project:", error);
            res.status(500).json({
                message: "Error fetching project",
            });
        });
    }
    // update project by id
    UpdatePost(req, res) {
        const { id } = req.params;
        const { title, content } = req.body;
        post_1.default.findByIdAndUpdate(id, {
            title: title,
            content: content,
        })
            .then((post) => {
            if (!post) {
                return res.status(404).json({
                    message: "Project not found",
                });
            }
            res.status(200).json({
                message: `Project updated ${post.title} successfully`,
                post: post,
            });
        })
            .catch((error) => {
            console.error("Error updating project:", error);
            res.status(500).json({
                message: "Error updating project",
            });
        });
    }
    // delete Project
    DeletePost(req, res) {
        const { id } = req.params;
        post_1.default.findByIdAndDelete(id)
            .then((post) => {
            if (!post) {
                return res.status(404).json({
                    message: "Project not found",
                });
            }
            res.status(200).json({
                message: `Project ${post.title} deleted successfully`,
                post: post,
            });
        })
            .catch((error) => {
            console.error("Error deleting project:", error);
            res.status(500).json({
                message: "Error deleting project",
            });
        });
    }
    // get all a contact
    ContactGet(req, res) {
        contact_1.default.find()
            .then((contacts) => {
            console.log("Fetched contacts:", contacts);
            if (contacts.length === 0) {
                return res.status(404).json({
                    message: "No contacts found",
                });
            }
            res.status(201).json({
                message: "contacts fetched successfully",
                contacts: contacts,
            });
        })
            .catch((error) => {
            console.error("Error fetching contacts:", error);
            res.status(500).json({
                message: "Error fetching contacts",
            });
        });
    }
    // post contact
    ContactPost(req, res) {
        const { email, subject, fname, lname, message } = req.body;
        const contact = new contact_1.default({
            email: email,
            names: `${fname} ${lname}`,
            message: message,
        });
        console.log(contact);
        res.status(201).json({
            message: `Contact information received ${fname} we will get back to you`,
            Contact: contact,
        });
        contact
            .save()
            .then((result) => {
            const info = transporter.sendMail({
                from: email, // sender address
                to: process.env.MAIL_USER,
                subject: subject, // Subject line
                text: message, // plain text body
                html: `<b>Dear frank is  ${fname} </b><br><p>${message}</p>`, // html body
            });
            const respondence = transporter.sendMail({
                from: process.env.MAIL_USER, // sender address
                to: email,
                subject: subject, // Subject line
                text: message, // plain text body
                html: `<b>Dear ${fname} </b><br><p>${process.env.RESPONSE_MESSAGE}</p><br><p> Thank you Frank</p>`, // html body
            });
            return info;
        })
            .then((info) => {
            console.log("Email sent:", info.response);
            res.status(201).json({
                message: `Contact information received ${fname} we will get back to you`,
                Contact: contact,
            });
        })
            .catch((error) => {
            console.error("Error saving contact:", error);
            res.status(500).json({
                message: "Error saving contact",
            });
        });
    }
    // get contact by email
    ContactGetById(req, res) {
        const { email } = req.params;
        contact_1.default.find({ email: email })
            .then((contact) => {
            if (!contact) {
                return res.status(404).json({
                    message: "Contact not found",
                });
            }
            res.status(200).json({
                message: `Contact fetched  ${email}successfully`,
                contact: contact,
            });
        })
            .catch((error) => {
            console.error("Error fetching contact:", error);
            res.status(500).json({
                message: "Error fetching contact",
            });
        });
    }
    // delete contact
    DeleteContact(req, res) {
        const { email } = req.params;
        contact_1.default.findOneAndDelete({ email: email })
            .then((contact) => {
            if (!contact) {
                return res.status(404).json({
                    message: "Contact not found",
                });
            }
            res.status(200).json({
                message: `Contact ${contact.names} deleted successfully`,
                contact: contact,
            });
        })
            .catch((error) => {
            console.error("Error deleting contact:", error);
            res.status(500).json({
                message: "Error deleting contact",
            });
        });
    }
};
__decorate([
    (0, decorators_1.get)("/"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], RouteController.prototype, "Home", null);
__decorate([
    (0, decorators_1.get)("/projects"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], RouteController.prototype, "Project", null);
__decorate([
    (0, decorators_1.post)("/projects"),
    (0, decorators_1.BodyValidator)("title", "description", "startDate", "endDate", "status", "githubLink", "websiteLink"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], RouteController.prototype, "ProjectPost", null);
__decorate([
    (0, decorators_1.get)("/projects/:id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], RouteController.prototype, "ProjectGetById", null);
__decorate([
    (0, decorators_1.patch)("/projects/:id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], RouteController.prototype, "UpdateProject", null);
__decorate([
    (0, decorators_1.del)("/projects/delete/:id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], RouteController.prototype, "DeleteProject", null);
__decorate([
    (0, decorators_1.get)("/posts"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], RouteController.prototype, "Post", null);
__decorate([
    (0, decorators_1.post)("/post"),
    (0, decorators_1.BodyValidator)("title", "content"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], RouteController.prototype, "CreatePost", null);
__decorate([
    (0, decorators_1.get)("/posts/:id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], RouteController.prototype, "PostGetById", null);
__decorate([
    (0, decorators_1.patch)("/posts/:id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], RouteController.prototype, "UpdatePost", null);
__decorate([
    (0, decorators_1.del)("/posts/delete/:id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], RouteController.prototype, "DeletePost", null);
__decorate([
    (0, decorators_1.get)("/contact"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], RouteController.prototype, "ContactGet", null);
__decorate([
    (0, decorators_1.post)("/contact"),
    (0, decorators_1.BodyValidator)("email", "subject", "fname", "lname", "message"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], RouteController.prototype, "ContactPost", null);
__decorate([
    (0, decorators_1.get)("/contact/:email"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], RouteController.prototype, "ContactGetById", null);
__decorate([
    (0, decorators_1.del)("/contact/delete/:email"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], RouteController.prototype, "DeleteContact", null);
RouteController = __decorate([
    (0, decorators_1.Controller)("")
], RouteController);
