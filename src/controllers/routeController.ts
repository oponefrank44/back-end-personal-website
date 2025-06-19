import { Request, Response, NextFunction } from "express";
// import nodemailer from "nodemailer";
import "dotenv/config";

import {
  get,
  Controller,
  post,
  BodyValidator,
  patch,
  del,
  use,
} from "./decorators";
import ProjectModel from "../models/project";
import { ModelStatus } from "../models/enum";
import ContactModel from "../models/contact";
import PostModel from "../models/post";

// Middleware to check for authorization token
function Authorizationrequest(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const token = req.headers.authorization;
  if (token) {
    console.log("Authorization token:", token);
    next();
  } else {
    res.status(401).json({
      message: "Unauthorized",

    });
  }
}

// const transporter = nodemailer.createTransport({
//   service: process.env.MAIL_SERVICE,
//   host: process.env.HOST,
//   port: 465,
//   secure: false,

//   auth: {
//     user: process.env.MAIL_USER,
//     pass:process.env.GMAIL_PASSWORD, // the app password Not your gmail password
//   },
// });

@Controller("")
class RouteController {
  // Project route for GET and POST
  @get("/")
  
  Home(req: Request, res: Response): void {
    
        res.status(201).json({
          message: "projects fetched successfully",
          projects: "welcome to the page",
        });
     
     
  }
  // get projects
  @get("/projects")
  Project(req: Request, res: Response): void {
    ProjectModel.find()
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
  @post("/projects")
  @BodyValidator(
    "title",
    "description",
    "startDate",
    "endDate",
    "status",
    "githubLink",
    "websiteLink"
  )
  ProjectPost(req: Request, res: Response): void {
    const {
      title,
      description,
      startDate,
      endDate,
      status,
      githubLink,
      websiteLink,
    } = req.body;
    console.log("Received project data:", req.body);

    const project = new ProjectModel({
      title: title,
      description: description,
      startDate: startDate,
      endDate: endDate,
      status: status || ModelStatus.NOTSTARTED,
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
  @get("/projects/:id")
  ProjectGetById(req: Request, res: Response): void {
    const { id } = req.params;
    ProjectModel.findById(id)
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
  @patch("/projects/:id")
  UpdateProject(req: Request, res: Response): void {
    const { id } = req.params;
    const {
      title,
      description,
      startDate,
      endDate,
      status,
      githubLink,
      websiteLink,
    } = req.body;

    ProjectModel.findByIdAndUpdate(id, {
      title: title,
      description: description,
      startDate: startDate,
      endDate: endDate,
      status: status || ModelStatus.NOTSTARTED,
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
  @del("/projects/delete/:id")
  DeleteProject(req: Request, res: Response): void {
    const { id } = req.params;
    ProjectModel.findByIdAndDelete(id)
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

 @get("/posts")
  Post(req: Request, res: Response): void {
    PostModel.find()
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
  @post("/post")
  @BodyValidator(
    "title",
    "content",
    
  )
  CreatePost(req: Request, res: Response): void {
    const {
      title,
     content,
     
    } = req.body;
    console.log("Received post data:", req.body);

    const post = new PostModel({
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
  @get("/posts/:id")
  PostGetById(req: Request, res: Response): void {
    const { id } = req.params;
    PostModel.findById(id)
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
  @patch("/posts/:id")
  UpdatePost(req: Request, res: Response): void {
    const { id } = req.params;
    const {
      title,
      content
     
    } = req.body;

    PostModel.findByIdAndUpdate(id, {
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
  @del("/posts/delete/:id")
  DeletePost(req: Request, res: Response): void {
    const { id } = req.params;
    PostModel.findByIdAndDelete(id)
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
  @get("/contact")
  ContactGet(req: Request, res: Response): void {
    ContactModel.find()
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
  @post("/contact")
  @BodyValidator("email", "subject", "fname", "lname", "message")
  ContactPost(req: Request, res: Response): void {
    const { email, subject, fname, lname, message } = req.body;
    const contact = new ContactModel({
      email: email,
      names: `${fname} ${lname}`,
      message: message,
    });
   
    contact
      .save()
      .then((result) => {
        // const info = transporter.sendMail({
        //   from: email, // sender address
        //   to: process.env.MAIL_USER,
        //   subject: subject, // Subject line
        //   text: message, // plain text body
        //   html: `<b>Dear frank is  ${fname} </b><br><p>${message}</p>`, // html body
        // });
        // const respondence = transporter.sendMail({
        //   from: process.env.MAIL_USER, // sender address
        //   to: email,
        //   subject: subject, // Subject line
        //   text: message, // plain text body
        //   html: `<b>Dear ${fname} </b><br><p>${process.env.RESPONSE_MESSAGE}</p><br><p> Thank you Frank</p>`, // html body
        // });
      
      
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
  @get("/contact/:email")
  ContactGetById(req: Request, res: Response): void {
    const { email } = req.params;
    ContactModel.find({ email: email })
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
  @del("/contact/delete/:email")
  DeleteContact(req: Request, res: Response): void {
    const { email } = req.params;
    ContactModel.findOneAndDelete({ email: email })
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
}
