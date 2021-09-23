import Head from 'next/head'
import { useSession } from 'next-auth/client'
import Posts from '../../../../components/posts'
import Layout from '../../../../components/layout'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import BlackHeart from '../../../../components/icons/BlackHeart'
import WhiteHeart from '../../../../components/icons/WhiteHeart'
import { isMobile } from 'react-device-detect'
import Uppy from '@uppy/core'
import AwsS3 from '@uppy/aws-s3'
import { Dashboard } from '@uppy/react'
import '@uppy/core/dist/style.css'
import '@uppy/drag-drop/dist/style.css'
import '@uppy/image-editor/dist/style.css'
import '@uppy/progress-bar/dist/style.css'
import '@uppy/dashboard/dist/style.css'
import { useToasts } from 'react-toast-notifications'
const ImageEditor = require('@uppy/image-editor')


export default function PostsByTopic() {
    const [session, loading] = useSession()
    const router = useRouter()
    const { topicId } = router.query
    const [topic, setTopic] = useState({})
    const [posts, setPosts] = useState([])
    const [pageNumber, setPageNumber] = useState(1)
    const [userHasLikedTopic, setUserHasLikedTopic] = useState(false)
    const [imageName, setImageName] = useState(undefined)
    const [showUppy, setShowUppy] = useState(false)
    const { addToast } = useToasts()

    const getTopic = async () => {
        try {
            const res = await axios.get(`/api/topics/${topicId}`)

            setTopic(res.data.topic)
        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        if (topicId) {
            getTopic()
        }

        if (session) {
            setUserHasLikedTopic(topic.likedBy && topic.likedBy.hasOwnProperty(session.user.id))
        }
    }, [topicId, session])

    const onLike = async () => {
        try {
            await axios.patch(`/api/topics/${topic._id}`, { liked: !userHasLikedTopic })

            getTopic()
        } catch (error) {
            console.log(error.message)
        }
    }


    const getPosts = async (page) => {
        try {
            const res = await axios.get(`/api/topics/${topicId}/posts`, { params: { page } })

            setPosts(res.data.posts)
        } catch (error) {
            console.log(error.message)
        }
    }
    useEffect(() => {
        getPosts(pageNumber)
        if (session) {
            setUserHasLikedTopic(topic.likedBy && topic.likedBy.hasOwnProperty(session.user.id))
        }
    }, [topicId, session, topic])

    const savePost = async event => {
        try {
            // event.preventDefault()
            const reqBody = { title: event.target.title.value, body: event.target.body.value, image: imageName }

            const res = await axios.post(`/api/topics/${topicId}/posts`, reqBody)

        } catch (error) {
            console.log(error)
        }
    }

    const onClickNext = () => {
        try {
            const newPageNumber = pageNumber + 1
            getPosts(newPageNumber)
            setPageNumber(newPageNumber)
        } catch (error) {
            console.log(error.message)
        }
    }

    const onClickBack = () => {
        try {
            const newPageNumber = pageNumber - 1
            getPosts(newPageNumber)
            setPageNumber(newPageNumber)
        } catch (error) {
            console.log(error.message)
        }
    }

    const handleShowUppy = () => {
        try {
            setShowUppy(!showUppy)
        } catch (error) {
            console.log(error.message)
        }
    }

    const uppy = new Uppy({
        autoProceed: isMobile ? true : false,
        debug: true,
    })
        .use(AwsS3, {
            limit: 1,
            timeout: 60 * 1000,
            getUploadParameters: async (file) => {

                const res = await axios.post('/api/signed-url', { type: 'putObject', key: `${session.user.id}/${file.name}`, contentType: file.type })

                const signedUrl = res.data.signedUrl
                return {
                    method: 'PUT',
                    url: signedUrl,
                    headers: {
                        'Content-Type': file.type
                    }
                }
            }
        })
        .use(ImageEditor, {
            id: 'ImageEditor',
            quality: 0.8,
            cropperOptions: {
                viewMode: 1,
                background: false,
                autoCropArea: 1,
                responsive: true
            },
            actions: {
                revert: true,
                rotate: true,
                granularRotate: true,
                flip: true,
                zoomIn: true,
                zoomOut: true,
                cropSquare: true,
                cropWidescreen: true,
                cropWidescreenVertical: true
            }
        })
        .on('file-editor:start', (file) => {
            console.log(file)
        })
        .on('file-editor:complete', (updatedFile) => {
            console.log(updatedFile)
        })
        .on('file-added', () => console.log('file added'))
        .on('upload-success', async (file) => {
            console.log('upload success', file)
            setImageName(file.name)
            addToast('Photo Successfully Uploaded', { appearance: "info" })
        })
        .on('upload-error', (error) => console.log('upload error', error))


    return (
        <div >
            <Head>
                <title>Posts</title>
            </Head>
            <Layout>

                <div className='topic-items'>
                    <h2>{topic.title}</h2>
                    {session && <button onClick={onLike}>{userHasLikedTopic ? <BlackHeart width={12} height={12} /> : <WhiteHeart width={12} height={12} />}</button>}
                </div>
                <h3>{topic.description}</h3>

                {session && <div className='post-form'>
                    <h4>Create A Post For This Topic</h4>
                    <form onSubmit={savePost}>
                        {/* <label htmlFor="name">Post Title: </label> */}
                        <input className='post-title' id='title' name='title' type="text" placeholder='title' required />
                        <br></br>
                        {/* <label htmlFor="name">Body: </label> */}
                        <textarea className='post-body' id='body' name='body' type="text" placeholder='body' required />
                        <br></br>
                        {showUppy && <div className='uploader'>
                            <Dashboard
                                uppy={uppy}
                                plugins={['ImageEditor', 'Informer']}
                                metaFields={[
                                    { id: 'caption', name: 'Location', placeholder: 'where was this photo taken?' }
                                ]}
                                hideProgressAfterFinish={'false'}
                                theme={'auto'}
                                showProgressDetails={true}
                            />
                        </div>
                        }
                        <button className='form-btn' type="button" onClick={handleShowUppy}> Add Photo </button>
                        <button className='form-btn' type="submit"> Add Post </button>
                        <button className='form-btn' type="reset"> Cancel </button>

                    </form>
                </div>}

                <Posts posts={posts} setPosts={setPosts} />
                {pageNumber > 1 && <button onClick={onClickBack}>Back</button>}

                {posts.length === 10 && <button onClick={onClickNext}>Next</button>}



            </Layout>
        </div>
    )
}
