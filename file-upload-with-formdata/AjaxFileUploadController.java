import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

@Controller
public class AjaxFileUploadController {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(AjaxFileUploadController.class);
	
	@RequestMapping(value="/upload-file", method=RequestMethod.POST,consumes = { "multipart/mixed", "multipart/form-data" })
	public void readFile(@RequestPart(value="inFile", required=true) MultipartFile inFile, @RequestPart("fileMetadata") FileDataStructure fileDataStructure) {
		try {
			LOGGER.debug("Entered @readFile");
			LOGGER.debug("File Name:"+inFile.getOriginalFilename()+" File Size:"+inFile.getSize()+" FileDataStructure(custom object):"+fileDataStructure);		
			LOGGER.debug("File Type:"+fileDataStructure.getFileType());
			LOGGER.debug("File Delimiter:"+fileDataStructure.getDelimiter());
		}catch (Exception e){
			LOGGER.error("Exception occurred while Reading data",e);
		}
	}

}
