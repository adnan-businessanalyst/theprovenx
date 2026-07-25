import { Router, type IRouter } from "express";
import healthRouter from "./health";
import meRouter from "./me";
import usersRouter from "./users";
import questionsRouter from "./questions";
import answersRouter from "./answers";
import commentsRouter from "./comments";
import tagsRouter from "./tags";
import categoriesRouter from "./categories";
import searchRouter from "./search";
import notificationsRouter from "./notifications";
import translateRouter from "./translate";
import flagsRouter from "./flags";
import statsRouter from "./stats";
import sponsorInquiriesRouter from "./sponsorInquiries";
import adminRouter from "./admin";
import { attachUser } from "../lib/currentUser";

const router: IRouter = Router();

router.use(healthRouter);
router.use(attachUser);
router.use(meRouter);
router.use(usersRouter);
router.use(questionsRouter);
router.use(answersRouter);
router.use(commentsRouter);
router.use(tagsRouter);
router.use(categoriesRouter);
router.use(searchRouter);
router.use(notificationsRouter);
router.use(translateRouter);
router.use(flagsRouter);
router.use(statsRouter);
router.use(sponsorInquiriesRouter);
router.use(adminRouter);

export default router;
