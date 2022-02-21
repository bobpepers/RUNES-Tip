/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import _ from 'lodash';
import db from '../../models';

const { Sequelize, Op } = require('sequelize');
const { getInstance } = require('../../services/rclient');

export const removeTriviaQuestion = async (
  req,
  res,
  next,
) => {
  try {
    const removeAnswers = await db.triviaanswer.destroy({
      where: {
        triviaquestionId: req.body.id,
      },
    });
    res.locals.trivia = await db.triviaquestion.destroy({
      where: {
        id: req.body.id,
      },
    });
    console.log(res.locals.trivia);
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

export const fetchTriviaQuestions = async (
  req,
  res,
  next,
) => {
  try {
    res.locals.trivia = await db.triviaquestion.findAll({
      order: [
        ['id', 'DESC'],
      ],
      include: [
        {
          model: db.triviaanswer,
          as: 'triviaanswers',
        },
      ],
    });
    console.log(res.locals.trivia);
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

export const insertTrivia = async (
  req,
  res,
  next,
) => {
  // console.log(req.body);
  if (req.body.question.question === '') {
    console.log('question cannot be empty');
    res.locals.error = 'question cannot be empty';
    return next();
  }
  if (req.body.question.answers.length < 2) {
    console.log('must have more then 2 answers');
    res.locals.error = 'must have more then 2 answers';
    return next();
  }
  if (!_.find(req.body.question.answers, { correct: 'true' })) {
    console.log('must have a correct answer');
    res.locals.error = 'must have a correct answer';
    return next();
  }

  try {
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

    res.locals.trivia = await db.triviaquestion.findOne({
      where: {
        id: question.id,
      },
      include: [
        {
          model: db.triviaanswer,
          as: 'triviaanswers',
        },
      ],
    });
    console.log(res.locals.trivia);
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};
