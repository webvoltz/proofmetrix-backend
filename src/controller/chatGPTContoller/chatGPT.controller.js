const { default: OpenAI } = require("openai");
const aIContentModel = require("../../models/aIContent/aIContent.model");
const { UNAUTHORIZED_USER, INTERNAL_SERVER_ERROR } = require("../../constants/error.constant");
const { userAuthorzization } = require("../../middleware/authorized.middleware");

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY,
});

const aiContentCreation = async (req, res) => {
    try {
        const { prompt } = req.body;
        let assistant_id;

        const userId = req.userId;

        const authorizationResult = await userAuthorzization(userId, req.userRole, res)

        if (!authorizationResult.status) {
            return res.status(authorizationResult.statusCode).json({
                status: false,
                message: authorizationResult.message
            });
        }

        if (!userId) {
            return res.status(401).json(UNAUTHORIZED_USER);
        }

        const promptClone = { ...prompt };

        delete promptClone.contentType;

        const aiContentData = new aIContentModel({
            contentType: prompt.contentType,
            userPrompt: { ...promptClone },
            userId: userId,
        });

        let aiContentSavedData = await aiContentData.save();

        const payload = [
            {
                role: "user",
                content: `
                DATA:
                [Niche]= ${prompt.niche}
                [Avatar]= ${prompt.avatar}
                [Primary Goal]= ${prompt.primaryGoal}
                [Primary Complaint]= ${prompt.primaryComplaint}
                [Positive Hook]= ${prompt.positiveHook}
                [Promises]= ${prompt.promises}
                [Benefits]= ${prompt.benifits}

                FORMULA:

                [number] methods the best [ avatars ] use to [ verb ] [ primary goal ]

                Serious secrets all [ avatars ] need to [ verb ] [ your secondary goal ]

                Revealed: [ verb ] [ primary goal ] without [ pain ]

                It took over [ number ] [ time ] to PROVE this works for any [ avatar ]. It was worth every second.

                It’s the only [ niche ] [ medium ] that delivered better than advertised.

                What everybody should know about [ topic ]

                Discover how to [ verb ] [ promise ] without [ pain ]

                Why is this [ niche ] guru giving away over [ total bonus value ]? (ends ([ deadline ])

                Got [ consequence ]?

                This [ verb ]s [ pronoun ] [ primary goal ]

                Now [ Avatars ] Can [ Benefit ] In Just [ Short Time Frame ]
                [Do something] like [world-class example]
                [Adjective] & [Adjective] [What You Are / SEO Keyword Phrase] That Will [Highly Desirable Promise of Results]
                Who Else Wants [Desired Result]?

                The Secret of [Clever Way To Achieve Primary Goal]

                Little Known Ways to [Clever Way To Achieve Primary Goal]

                Here Is a Method That Is Helping [Avatars] [Primary Goal]

                Get Rid of [problem] Once and For All

                Now You Can [Primary Goal] Without [Objection]

                What Everybody Ought to Know About [Niche]
                Give Me [Short Time] And I’ll Give You [Desired Result]

                The Lazy [Avatar’s] Way to [Primary Goal]

                Do You Recognize the [number] Early Warning Signs of [Topic Of Avatar Concern]?

                See How Easily You Can [desirable result]

                You Don’t Have to Be [something challenging] To Be [desired result]

                How These [Niche] Strategies Made Me [After Result]

                If You’re [Very Small Requirement], You Can [Very Large Goal]

                How to [Achieve Desired Outcome] in [Specific Time Frame]

                [Number] Secrets to [Achieve Desired Outcome]

                The Ultimate Guide to [Topic]
                Why You’re [Not Achieving Desired Outcome] And How to Fix It

                [Number] Simple Steps to [Achieve Desired Outcome]

                [Number] Mistakes Most People Make When [Common Action]

                The Sinister Truth About [Topic]

                [Number] [Topic] Tips You Can’t Afford to Miss

                [Topic]: What No One Is Talking About

                How [Product/Service] Can [Benefit]

                The [Topic] That Made [Person/Company] a [Success/Leader]

                Get Rid of [Problem] Once and For All

                [Do Something] Like [World-Class Example]

                What [Group or Expert] Knows About [Topic] That You Don’t

                The [Number] Minute [Topic] Solution

                The [Topic] Revolution: [Benefit/Change]

                The [Topic] Blueprint for [Desired Outcome]

                Discover the [Topic] That [Benefit]

                [Topic]: [Question]

                [Number] [Topic] Myths Busted

                > Act as if you are a professional direct response copywriter who loves to use visceral, real-life, simple but dimensional language. Then create 20 headlines. Use the structures in FORMULA using DATA as content and context. Make some of the subject lines questions. Do not use a colon. Write without exclamation points:`,
            },
        ];

        const response_prompt_first =
            "You are a professional direct response copywriter. Rewrite each of the headlines above with dimensional, vivid examples in context of the headline itself. Do not make up avatars. This has to be general. Just elaborate a bit for each example using dimensional language.";
        const response_prompt_second =
            "You are a professional direct response copywriter. Rewrite each of the headlines above, but work the dimensional aspect of the copy more into the headlines. Get even more clever with how you’re using them. Make each headline mysterious and so compelling I have to keep reading. ";

        const assistants = await openai.beta.assistants.list({
            order: "desc",
            limit: "20",
        });

        const myAssistant = assistants.data.filter((data) => data?.name === "Headline Generation Bot.");

        if (assistants.data.length > 0 && myAssistant.length > 0) {
            assistant_id = myAssistant[0].id;
        } else {
            const assistant = await openai.beta.assistants.create({
                name: "Headline Generation Bot.",
                instructions: "You are a personal content creator. write professonal headlines for the user.",
                tools: [{ type: "code_interpreter" }],
                model: "gpt-4-turbo",
            });
            assistant_id = assistant.id;
        }

        const thread = await openai.beta.threads.create();

        await openai.beta.threads.messages.create(thread.id, {
            role: "user",
            content: payload[0].content,
        });

        await openai.beta.threads.runs.createAndPoll(thread.id, {
            assistant_id: assistant_id,
        });

        await openai.beta.threads.messages.create(thread.id, {
            role: "user",
            content: response_prompt_first,
        });

        await openai.beta.threads.runs.createAndPoll(thread.id, {
            assistant_id: assistant_id,
        });

        await openai.beta.threads.messages.create(thread.id, {
            role: "user",
            content: response_prompt_second,
        });

        let run = await openai.beta.threads.runs.createAndPoll(thread.id, {
            assistant_id: assistant_id,
        });

        let messages;

        if (run.status === "completed") {
            messages = await openai.beta.threads.messages.list(run.thread_id);
        } else {
            console.log(run.status);
        }

        aiContentSavedData.aiResponse = messages.data[0].content[0].text.value;

        await aiContentData.save();

        return res.status(201).json({
            status: true,
            data: aiContentSavedData,
        });
    } catch (error) {
        console.log("error", error);
        return res.status(500).json({
            error: error,
        });
    }
};

const listAiCreatedContent = async (req, res) => {
    try {
        const userId = req.userId;

        const authorizationResult = await userAuthorzization(userId, req.userRrole, res)

        if (!authorizationResult.status) {
            return res.status(authorizationResult.statusCode).json({
                status: false,
                message: authorizationResult.message
            });
        }

        let templateData = await aIContentModel.find({ isDeleted: false, userId: userId }).sort({ createdAt: -1 });

        const count = templateData.length;
        return res.status(201).json({
            status: true,
            message: "Ai Content listed successfully",
            count: count,
            data: templateData,
        });
    } catch (error) {
        console.log("error", error);
        return res.status(500).json(INTERNAL_SERVER_ERROR);
    }
};

const viewAiCreatedContent = async (req, res) => {
    try {
        const userId = req.userId;
        const itemId = req.params.id;

        const authorizationResult = await userAuthorzization(userId, req.userRrole, res)

        if (!authorizationResult.status) {
            return res.status(authorizationResult.statusCode).json({
                status: false,
                message: authorizationResult.message
            });
        }

        let templateData = await aIContentModel.find({ isDeleted: false, userId: userId, _id: itemId });

        return res.status(201).json({
            status: true,
            message: "Ai Content listed successfully",
            data: templateData,
        });
    } catch (error) {
        console.log("error", error);
        return res.status(500).json(INTERNAL_SERVER_ERROR);
    }
};

const deleteCratedContent = async (req, res) => {
    try {
        const userId = req.userId;
        const itemId = req.params.id;

        const authorizationResult = await userAuthorzization(userId, req.userRrole, res)

        if (!authorizationResult.status) {
            return res.status(authorizationResult.statusCode).json({
                status: false,
                message: authorizationResult.message
            });
        }

        const addData = await aIContentModel.findOneAndUpdate(
            { _id: itemId },
            {
                $set: { isDeleted: true },
            },
            { new: true }
        );

        return res.status(200).json({
            status: true,
            message: "Ai content deleted successfully.",
            data: addData,
        });
    } catch (error) {
        console.log("error", error);
        return res.status(500).json(INTERNAL_SERVER_ERROR);
    }
};

module.exports = { aiContentCreation, listAiCreatedContent, viewAiCreatedContent, deleteCratedContent };
