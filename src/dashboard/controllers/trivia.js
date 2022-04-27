/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import _ from 'lodash';
import db from '../../models';

export const removeTriviaQuestion = async (
  req,
  res,
  next,
) => {
  const removeAnswers = await db.triviaanswer.destroy({
    where: {
      triviaquestionId: req.body.id,
    },
  });

  res.locals.removeQuestion = await db.triviaquestion.destroy({
    where: {
      id: req.body.id,
    },
  });

  res.locals.name = 'removeTriviaQuestion';
  res.locals.result = {
    id: req.body.id,
  };
  next();
};

export const switchTriviaQuestion = async (
  req,
  res,
  next,
) => {
  const findTriviaQuestion = await db.triviaquestion.findOne({
    where: {
      id: req.body.id,
    },
  });
  await findTriviaQuestion.update({
    enabled: !findTriviaQuestion.enabled,
  });
  res.locals.name = 'switchTriviaQuestion';
  res.locals.result = await db.triviaquestion.findOne({
    where: {
      id: findTriviaQuestion.id,
    },
    include: [
      {
        model: db.trivia,
        as: 'trivia',
        attributes: ['id'],
      },
      {
        model: db.triviaanswer,
        as: 'triviaanswers',
      },
    ],
  });

  next();
};

export const fetchTriviaQuestions = async (
  req,
  res,
  next,
) => {
  res.locals.name = 'fetchTriviaQuestions';
  res.locals.result = await db.triviaquestion.findAll({
    order: [
      ['id', 'DESC'],
    ],
    include: [
      {
        model: db.trivia,
        as: 'trivia',
        attributes: ['id'],
      },
      {
        model: db.triviaanswer,
        as: 'triviaanswers',
      },
    ],
  });
  res.locals.count = await db.triviaquestion.count();
  next();
};

export const insertTrivia = async (
  req,
  res,
  next,
) => {
  if (req.body.question.question === '') {
    throw new Error("question cannot be empty");
  }
  if (req.body.question.answers.length < 2) {
    throw new Error("must have more then 2 answers");
  }
  if (req.body.question.answers.length > 5) {
    throw new Error("maximum is 5 answers");
  }
  if (!_.find(req.body.question.answers, { correct: 'true' })) {
    throw new Error("must have a correct answer");
  }

  const question = await db.triviaquestion.create({
    question: req.body.question.question,
  });

  for (const answer of req.body.question.answers) {
    console.log(answer);
    const newAnswer = await db.triviaanswer.create({
      triviaquestionId: question.id,
      correct: answer.correct === 'true',
      answer: answer.answer,
    });
  }

  res.locals.name = 'insertTrivia';
  res.locals.result = await db.triviaquestion.findOne({
    where: {
      id: question.id,
    },
    include: [
      {
        model: db.trivia,
        as: 'trivia',
        attributes: ['id'],
      },
      {
        model: db.triviaanswer,
        as: 'triviaanswers',
      },
    ],
  });

  console.log(res.locals.result);
  next();
};
