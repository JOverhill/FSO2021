import React from 'react'

const Header = ({title}) => {
    return (<h1>{title}</h1>)
}

const Content = ({excercises, id}) => {
    return(
        excercises.map(part => {
            return <li key={part.id}>{part.name} {part.excercises}</li>       })
    )
}

const Total = ({excercises}) => {
    return <p>Number of exercises: {excercises.reduce( (total, num) => {
        return { "exercises": total.exercises + num.exercises } }
        ).exercises } 
        </p>
}

const Course = ({course}) => {
    
    return (
        <>
            <Header title={course.name} />
            <Content excercises={course.parts} id={course.id} />
            <Total excercises={course.parts} />
        </>
    )
}

const Courses = ({courses}) => {
 //   console.log(courses)
    return(
        <>
        {courses.map((course) => <Course key={course.id} course={course}/>)}
        </>
    )
}

export default Courses